declare module 'comlink-loader!*' {
    class WebpackWorker extends Worker {
      constructor();
  
      // Add any custom functions to this class.
      // Make note that the return type needs to be wrapped in a promise.
      runGetStatistics(courseCount: number, preferences: CoursePreferences, repeatWeight: number): Promise<CoursePreferences[]>;
    }
  
    export = WebpackWorker;
  }