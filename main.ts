/**
 * This class implements the scheduler API.
 */
class SimpleScheduler {
    private wfJson; 
    private wfId; 
    private wflib;

    constructor(config, wflib) {
        this.wfJson = config.wfJson;
        this.wfId = config.wfId;
        this.wflib = wflib;

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
     * Scheduler API method used to wait for permission to execute a task
     * 
     * @param wfId   - workflow identifier (integer 1..N)
     * @param procId - process identifier (integer 1..N) 
     *                 NOTE! taskData = wfJson[procId-1]
     * @returns name of the node to run the task on
     */
    async getTaskExecutionPermission(wfId, procId: string) {
        return new Promise<string>((resolve, reject) => {
            console.log("Scheduler computing...");
            setTimeout(() => resolve("testNodeName"), 2000);
        });
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
    notifyTaskCompletion(wfId, procId) { }
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