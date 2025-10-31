const DEVICE_ID_STORAGE_KEY = "device-id";

// Device ID is used to identify unique users. This is needed when we want
// retain the same conversation for the same user. Since users are guests and
// not authenticated, we use device ID to identify unique users.
export function getDeviceId(): string {
    try {
        const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
        if (existing) return existing;
        const newId = crypto.randomUUID();
        window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, newId);
        return newId;
    } catch {
        return crypto.randomUUID();
    }
}
