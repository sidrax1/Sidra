export interface StudioFollower {
  readonly id: string;
  readonly studioId: string;
  readonly userId: string;

 readonly notificationsEnabled: boolean;
 readonly createdAt: string;
 readonly updatedAt: string;
}
