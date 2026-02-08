/**
 * Enhanced logging utilities for PE tools
 */

export function logToolStart(toolName: string, input: any) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🔧 [${toolName}] STARTED`);
  console.log(`📥 Input:`, JSON.stringify(input, null, 2));
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log(`${"=".repeat(60)}\n`);
}

export function logToolSuccess(toolName: string, summary: string, data?: any) {
  console.log(`\n✅ [${toolName}] SUCCESS`);
  console.log(`📊 ${summary}`);
  if (data) {
    console.log(
      `📤 Output preview:`,
      JSON.stringify(data, null, 2).substring(0, 500),
    );
  }
  console.log(`${"=".repeat(60)}\n`);
}

export function logToolError(toolName: string, error: any) {
  console.error(`\n❌ [${toolName}] ERROR`);
  console.error(`🔴 Error message:`, error.message || error);
  console.error(`📚 Stack trace:`, error.stack);
  console.error(`${"=".repeat(60)}\n`);
}

export function logDatabaseQuery(toolName: string, queryName: string) {
  console.log(`🗄️  [${toolName}] Executing database query: ${queryName}`);
}

export function logExternalCall(
  toolName: string,
  service: string,
  query: string,
) {
  console.log(`🌐 [${toolName}] External call to ${service}: "${query}"`);
}
