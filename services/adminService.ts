import { callableFunction } from "@/firebase/functions";
import type { UserRole } from "@/constants/roles";
import type { User } from "@/types/user";
import type { Product } from "@/types/product";
import type { Studio } from "@/types/studio";

interface UpdateUserRoleRequest {
  readonly userId: string;
  readonly role: UserRole;
  readonly studioId?: string | null;
  readonly reason: string;
}

interface UpdateUserRoleResponse {
  readonly user: User;
}

interface ModerateProductRequest {
  readonly productId: string;

    readonly decision:
     | "approve"
     | "reject"
     | "archive";
    readonly reason?: string;
}

interface ModerateProductResponse {
  readonly product: Product;
}

interface UpdateStudioStatusRequest {
  readonly studioId: string;
  readonly status:
   | "active"
   | "suspended"
   | "closed";
  readonly reason: string;
}

interface UpdateStudioStatusResponse {
  readonly studio: Studio;
}

interface ExecuteFounderCommandRequest {
  readonly command: string;
  readonly confirmationToken?: string;
}

interface ExecuteFounderCommandResponse {
  readonly executionId: string;
  readonly status:
   | "completed"
   | "confirmationRequired";
  readonly message: string;
  readonly affectedEntityIds: readonly string[];
  readonly confirmationToken?: string;
}

const updateUserRoleCallable = callableFunction<
 UpdateUserRoleRequest,
 UpdateUserRoleResponse
>("updateUserRole");

const moderateProductCallable = callableFunction<
 ModerateProductRequest,
 ModerateProductResponse
>("moderateProduct");

const updateStudioStatusCallable = callableFunction<
 UpdateStudioStatusRequest,
 UpdateStudioStatusResponse
>("updateStudioStatus");

const executeFounderCommandCallable = callableFunction<
 ExecuteFounderCommandRequest,
 ExecuteFounderCommandResponse
>("executeFounderCommand");

export async function updateUserRole(
  input: UpdateUserRoleRequest
): Promise<User> {
  const result = await updateUserRoleCallable(input);

    return result.data.user;
}

export async function moderateProduct(
  input: ModerateProductRequest
): Promise<Product> {
  const result = await moderateProductCallable(input);

    return result.data.product;
}

export async function updateStudioStatus(
  input: UpdateStudioStatusRequest
): Promise<Studio> {
  const result = await updateStudioStatusCallable(input);

    return result.data.studio;
}

export async function executeFounderCommand(
  input: ExecuteFounderCommandRequest
): Promise<ExecuteFounderCommandResponse> {
  const result = await executeFounderCommandCallable(input);

 return result.data;
}
