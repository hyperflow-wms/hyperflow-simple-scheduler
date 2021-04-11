# Hyperflow simple scheduler

This project is a template for implementing a workflow scheduler for Hyperflow. 

## Building
```
npm run compile
```

## Installation
The scheduler needs to be installed as a `Node.js` package which is loaded as a Hyperflow plugin.

### Install globally from package
Coming soon.

### Install from local directory
For development, you can install the scheduler package as a symbolic link in the `hypeflow/node_modules` folder:  
```
git clone https://github.com/hyperflow-wms/hyperflow-simple-scheduler
cd hyperflow
npm install ../hyperflow-simple-scheduler
```

## Running
```
hflow run workflow.json -p @hyperflow/simple-scheduler-plugin
```

## API
See [Scheduler demo example](https://github.com/hyperflow-wms/hyperflow/tree/master/examples/SchedulerDemo)

