const promise = new promise((resolve, reject) => {
  setTimeout(() => {
    resolve("bring the tacos");
  }, 5000);
});

const promise1 = new promise((resolve, reject) => {
    setTimeout(() => {
      reject("not bring the tacos");
    }, 5000);
  });

  const onFullfill =(result) =>{
    console.log(result)
    console.log("set the table")
  }

  const onReject = (error) =>{
    console.log(error)
    console.log("start cooking")
  }

  promise.then(onFullfill)
  promise.catch(onReject)
