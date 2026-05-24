type SimpleTask = {
    name: string;
    run: () => void;
};
type PromiseTask = {
    name: string;
    gen: () => Promise<void>;
};
export type Task = SimpleTask | PromiseTask | (() => void);
export declare class TaskQueue {
    private _queueStack;
    private _onMoreTasks;
    constructor({ onMoreTasks }: {
        onMoreTasks: () => void;
    });
    enqueue(task: Task): void;
    enqueueTasks(tasks: Task[]): void;
    cancelTasks(tasksToCancel: Task[]): void;
    hasTasksToProcess(): boolean;
    /**
     * Executes the next task in the queue.
     */
    processNext(): void;
    private _getCurrentQueue;
    private _genPromise;
}
export {};
