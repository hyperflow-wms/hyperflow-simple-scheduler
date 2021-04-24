/**
 * This class implements the scheduler API.
 */
class SimpleScheduler {
    private wfJson; 
    private wfId; 
    private wflib;
    private jobAgglomerations;

    constructor(config, wflib) {
        this.wfJson = config.wfJson;
        this.wfId = config.wfId;
        this.wflib = wflib;
        this.jobAgglomerations = null; 

        // Here additional configuration could be read needed to
        // compute the schedule, e.g.:
        // - list of nodes 
        // - computation costs of tasks, etc.

        this.computeSchedule();
    }

    private computeSchedule() {
        let wfGraph = this.wfJson;
        console.log("Scheduling workflow, #tasks=" + wfGraph.processes.length)

        // TODO
        // Here the scheduler should compute the schedule for the workflow
        // and store it in some internal data structures
    }

    /**
     * 
     * Scheduler API method used to synchronously wait for permission 
     * to execute a task
     * 
     * @param wfId   - workflow identifier (integer 1..N)
     * @param procId - process identifier (integer 1..N) 
     *                 NOTE! taskData = wfJson[procId-1]
     * @returns name of the node to run the task on
     */
    async getTaskExecutionPermission(wfId, procId: string) {
        return new Promise<string>((resolve, reject) => {
            console.log("Scheduler computing...");
            setTimeout(() => resolve("testNodeName-sync"), 2000);
        });
    }

    /**
     * addTaskItem
     * 
     * Scheduler API function which is an asynchronous alternative to
     * 'getTaskExecutionPermission', at the same time allowing to
     * execute tasks in groups (agglomeration).
     * 
     * @param taskItem - JSON object with the following structure:
     * {
     *   "ins": ins,
     *   "outs": outs,
     *   "context": context,
     *   "cb": cb
     * }
     * where: 
     * - 'ins', 'outs', 'context' and 'cb' are parameters of the task 
     * function from which 'addTaskItem' has been called.
     * 
     * @param {(taskArray, node)} taskFunctionCb - a callback function to be called 
     * by the scheduler to execute the task(s) passed as 'taskArray'. 
     * The parameters are:
     * - @param taskArray - an array of 'taskItem' objects
     * - @param node - is the name of the node assigned by the scheduler for the task (group)
     * 
     * Example of such function (without the 'node' parameter) is 'k8sCommandGroup':
     * https://github.com/hyperflow-wms/hyperflow/blob/56f1f6e041e79b270753f66c0c07dd04bf7d00c5/functions/kubernetes/k8sCommand.js#L22
     * 
     * Allowing task arrays enables the scheduler to agglomerate tasks
     * into groups. Configuration of task agglomeration (if any), is passed as 
     * 'taskItem.context.appConfig.jobAgglomerations'
     * (see https://github.com/hyperflow-wms/hyperflow/wiki/Task-agglomeration)
     * (Note that for a given workflow it is sufficient to read this configuration
     * only once, even though each task item will contain it.)
     *      
     */
    addTaskItem(taskItem, taskFunctionCb) {
        let wfId = taskItem.context.appId;
        let procId = taskItem.context.procId;
        let taskData = this.wfJson[procId-1];

        if (!this.jobAgglomerations) {
            this.jobAgglomerations = 
                taskItem.context.appConfig.jobAgglomerations; // could be undefined
        }

        // Here the scheduler simply immediately invokes the callback to execute the task
        return taskFunctionCb([taskItem], "testNodeName-async");
    }

    /**
     * 
     * Scheduler API method whereby the scheduler receives information 
     * that task @procId in workflow @wfId has been completed. 
     * Here the scheduler can trigger execution of next task(s).
     * A dynamic scheduler can even recompute the schedule, etc. 
     * 
     * @param wfId - workflow identifier (integer 1..N)
     * @param procId - process identifier (integer 1..N)
     */
    notifyTaskCompletion(wfId, procId) { 
        console.log("Task", procId, "in workflow", wfId, "has been finished.");
    }
}

/**
 * This class implements the scheduler Plugin.
 */
class SimpleSchedulerPlugin {
    // setting 'pgtype' (plugin type) to 'scheduler' will make Hyperflow 
    // pass the workflow graph as part of this plugin's configuration
    private pgtype = "scheduler"; 

    name: string;
    
    constructor(name: string) {
        this.name = name;
    }

    get pgType() {
        return this.pgtype;
    }

    init(redisClient, wflib, engine, config) {
        var scheduler = new SimpleScheduler(config, wflib);

        // 'scheduler' will be available in workflow functions
        // as 'context.appConfig.scheduler'
        engine.config.scheduler = scheduler;
    }
}

export = SimpleSchedulerPlugin;