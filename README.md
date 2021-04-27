# Hyperflow simple scheduler

This project is a template for implementing a workflow scheduler for Hyperflow. 

## Building
```
npm run compile
```

## Installation
The scheduler needs to be installed as a `Node.js` package which is loaded as a Hyperflow plugin.

### Install globally from package
This is a template project for development purposes, no global package is available.

### Install from local directory
For development, it is convenient to install the scheduler package as a symbolic link in the `hypeflow/node_modules` folder, e.g.:  
```
git clone https://github.com/hyperflow-wms/hyperflow
git clone https://github.com/hyperflow-wms/hyperflow-simple-scheduler
cd hyperflow
npm install ../hyperflow-simple-scheduler
```

## API
A scheduler in general makes two decisions: (1) *when* (at which point in time) and (2) *where* (on which node) to run a *workflow task*. To this end, three API functions are provided for use in the implementation of workflow task functions:

```
let node = await scheduler.getTaskExecutionPermission(context.appId, context.procId);
```
This function will wait until the scheduler permits to execute the task (*when*) and return the node name on which the task should be executed (*where*).

```
scheduler.addTaskItem(taskItem, taskFunctionCb)
```
This is an asynchronous alternative of `getTaskExecutionPermission`, also enabling the scheduler to [agglomerate tasks](https://github.com/hyperflow-wms/hyperflow/wiki/Task-agglomeration). See documentation in the code for details.

```
scheduler.notifyTaskCompletion(context.appId, context.procId);
```
This function should be used to notify that a task has been completed. This allows the scheduler to trigger subsequent tasks, or even update the execution schedule. 

## Running
To use a scheduler, you need to load the scheduler plugin when running the workflow:
```
hflow run workflow.json -p @hyperflow/simple-scheduler-plugin
```

The scheduler API will be available to task functions via `context.appConfig.scheduler`. See [scheduler demo example](https://github.com/hyperflow-wms/hyperflow/tree/master/examples/SchedulerDemo). 

