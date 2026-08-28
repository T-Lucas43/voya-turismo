CREATE INDEX `AuditLog_action_ipHash_createdAt_idx`
ON `AuditLog`(`action`, `ipHash`, `createdAt`);
