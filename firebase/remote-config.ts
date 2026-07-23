import {
  fetchAndActivate,
  getRemoteConfig,
  getString,
  isSupported,
  type RemoteConfig,
} from "firebase/remote-config";

import { firebaseApp } from "@/firebase/client";
import { logger } from "@/lib/logger";

let remoteConfig: RemoteConfig | null = null;

export async function getFirebaseRemoteConfig(): Promise<RemoteConfig | null> {
 if (
   typeof window === "undefined" ||
   !(await isSupported())
 ){

        return null;
    }

    if (remoteConfig) {
      return remoteConfig;
    }

    remoteConfig = getRemoteConfig(firebaseApp);

    remoteConfig.settings = {
      minimumFetchIntervalMillis:
       process.env.NODE_ENV === "production"
         ? 60 * 60 * 1000
         : 0,
      fetchTimeoutMillis: 10000,
    };

    remoteConfig.defaultConfig = {};

    try {
      await fetchAndActivate(remoteConfig);
    } catch (error) {
      logger.warn(
        "Remote Config activation failed.",
        error
      );
    }

    return remoteConfig;
}

export async function getRemoteString(
  key: string
): Promise<string> {
  const config = await getFirebaseRemoteConfig();

    if (!config) {
      return "";
    }

  return getString(config, key);
}
