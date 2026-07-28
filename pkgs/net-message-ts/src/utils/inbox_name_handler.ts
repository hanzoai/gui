export class NameError extends Error {
  constructor(public type: 'InvalidFormat' | 'ReceiverNotFound') {
    super(`Name Error: ${type}`);
    this.name = 'NameError';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export const isIdentityLocalhost = (
  identity: string,
): boolean => {
  return (
    identity.includes('localhost.arb-sep-hanzo') ||
    identity.includes('localhost.sep-hanzo') ||
    identity.includes('localhost.hanzo')
  );
};

export const extractJobIdFromInbox = (deserializedId: string): string => {
  const parts: string[] = deserializedId.split('::');
  if (parts.length < 3 || !isJobInbox(deserializedId)) {
    throw new NameError('InvalidFormat');
  }

  const jobId = parts[1];
  return jobId;
};

export const isJobInbox = (inboxId: string): boolean => {
  const parts: string[] = inboxId.split('::');
  if (parts.length < 3) {
    throw new NameError('InvalidFormat');
  }
  return parts[0] === 'job_inbox';
};

export const buildInboxIdFromJobId = (jobId: string): string => {
  // TODO: job_inbox, false is hardcoded
  return `job_inbox::${jobId}::false`;
};
