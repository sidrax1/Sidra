import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { callableFunction } from "@/firebase/functions";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { AutomationRule } from "@/types/automation";

interface SaveAutomationRuleRequest {
  readonly ruleId?: string;
  readonly name: string;
  readonly trigger: string;
  readonly enabled: boolean;
  readonly conditions: AutomationRule["conditions"];
  readonly actions: AutomationRule["actions"];
}

interface SaveAutomationRuleResponse {

    readonly rule: AutomationRule;
}

interface ExecuteAutomationRuleRequest {
  readonly ruleId: string;
  readonly context: Record<string, unknown>;
}

interface ExecuteAutomationRuleResponse {
  readonly executionId: string;
  readonly successfulActions: number;
  readonly failedActions: number;
}

const saveAutomationRuleCallable =
 callableFunction<
  SaveAutomationRuleRequest,
  SaveAutomationRuleResponse
 >("saveAutomationRule");

const executeAutomationRuleCallable =
 callableFunction<
  ExecuteAutomationRuleRequest,
  ExecuteAutomationRuleResponse
 >("executeAutomationRule");

export async function saveAutomationRule(
  input: SaveAutomationRuleRequest
): Promise<AutomationRule> {
  const result =
    await saveAutomationRuleCallable(
      input
    );

    return result.data.rule;
}

export async function executeAutomationRule(
  input: ExecuteAutomationRuleRequest
): Promise<ExecuteAutomationRuleResponse> {
  const result =
    await executeAutomationRuleCallable(
      input
    );

    return result.data;
}

export async function getAutomationRules(): Promise<AutomationRule[]> {
 const snapshot = await getDocs(
   query(
     collection(
       getFirebaseFirestore(),
       COLLECTIONS.AUTOMATION_RULES
     ),
     orderBy("createdAt", "desc")
   )
 );

    return snapshot.docs.map(
      (ruleDocument) =>
        ({
          id: ruleDocument.id,
          ...ruleDocument.data(),
        }) as AutomationRule
    );
}
