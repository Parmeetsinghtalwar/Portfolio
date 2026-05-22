const RESTLI_HEADERS = {
  Authorization: '',
  'X-Restli-Protocol-Version': '2.0.0',
  'Content-Type': 'application/json',
} as const

type RegisterUploadResponse = {
  value: {
    uploadMechanism: {
      'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest': {
        uploadUrl: string
        headers?: Record<string, string>
      }
    }
    asset: string
  }
}

export async function publishLinkedInImagePost(
  accessToken: string,
  personId: string,
  imageBuffer: Buffer,
  mimeType: string,
  caption: string,
): Promise<{ postId: string }> {
  const owner = `urn:li:person:${personId}`
  const authHeaders = {
    ...RESTLI_HEADERS,
    Authorization: `Bearer ${accessToken}`,
  }

  const registerRes = await fetch(
    'https://api.linkedin.com/v2/assets?action=registerUpload',
    {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner,
          serviceRelationships: [
            {
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent',
            },
          ],
        },
      }),
    },
  )

  if (!registerRes.ok) {
    const err = await registerRes.text()
    throw new Error(
      `LinkedIn register upload failed: ${registerRes.status} ${err.slice(0, 300)}`,
    )
  }

  const registered = (await registerRes.json()) as RegisterUploadResponse
  const uploadUrl =
    registered.value.uploadMechanism[
      'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
    ].uploadUrl
  const assetUrn = registered.value.asset

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mimeType,
      ...(registered.value.uploadMechanism[
        'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
      ].headers ?? {}),
    },
    body: new Uint8Array(imageBuffer),
  })

  if (!uploadRes.ok) {
    const err = await uploadRes.text()
    throw new Error(
      `LinkedIn image upload failed: ${uploadRes.status} ${err.slice(0, 300)}`,
    )
  }

  const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      author: owner,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: caption },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: 'READY',
              description: { text: caption.slice(0, 200) },
              media: assetUrn,
              title: { text: 'SocialHub demo' },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }),
  })

  if (!postRes.ok) {
    const err = await postRes.text()
    throw new Error(
      `LinkedIn post failed: ${postRes.status} ${err.slice(0, 300)}`,
    )
  }

  const postId = postRes.headers.get('x-restli-id') ?? 'published'
  return { postId }
}
