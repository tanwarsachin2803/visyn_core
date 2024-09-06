class Functionalities {
    private dataSort: string;
    private dataType: string;
  
    constructor(dataSort: string, dataType: string) {
      this.dataSort = dataSort;
      this.dataType = dataType;
    }
  
    public checkSortFunctionality(sortingAvailable: string): void {
      if (sortingAvailable === 'yes') {
       if(this.dataType.match('number')){
        if(this.dataSort.match('asc')){

        }
        else{
            
        }
       }
       else if(this.dataType.match('categorical')){}
       else{} 
      } else {
        console.log(`Sorting is not available for ${this.dataType} data`);
      }
    }
  }