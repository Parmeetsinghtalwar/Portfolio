export type CameraPermissionState = 'unknown' | 'granted' | 'denied' | 'skipped'

let sharedStream: MediaStream | null = null
let permissionState: CameraPermissionState = 'unknown'

export function getCameraPermissionState(): CameraPermissionState {
  return permissionState
}

export function getCameraStream(): MediaStream | null {
  if (sharedStream?.active) return sharedStream
  return null
}

export function setCameraStream(stream: MediaStream | null) {
  sharedStream = stream
}

export function markCameraSkipped() {
  permissionState = 'skipped'
}

export function releaseCameraStream() {
  sharedStream?.getTracks().forEach((t) => t.stop())
  sharedStream = null
  if (permissionState === 'granted') {
    permissionState = 'unknown'
  }
}

export async function requestCameraAccess(): Promise<CameraPermissionState> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    permissionState = 'denied'
    return 'denied'
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      audio: false,
    })
    sharedStream = stream
    permissionState = 'granted'
    return 'granted'
  } catch {
    permissionState = 'denied'
    return 'denied'
  }
}

export function isCameraSetupResolved(): boolean {
  return (
    permissionState === 'granted' ||
    permissionState === 'denied' ||
    permissionState === 'skipped'
  )
}
