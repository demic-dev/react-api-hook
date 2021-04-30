# react-api-hook


###### This package was created to simplify the handling of REST calls in React.

To use this package, simply declare it in the component, inserting the endpoint and possible configurations (headers, body, etc.) and call it with the appropriate sendRequest function.

The state of the call can be read from the state variable.

Finally, to cancel the request, instead, it is sufficient to call the cancelRequest function.

The state of the call has the following values:
* _idle_
* _loading_
* _success_
* _failure_
* _inAbort_
* _canceled_

In case it is _success_ or _failure_, it will also have the properties
_data_ and _error_ respectively.



| state | type |  description |
|--|--|--|
| idle | string | The hook is ready to send a request. |
| loading | string | The hook sent the request, is waiting for response. |
| success | string | The hook succesfully received the response. Is ready to send another request. |
| failure | string | The hook catches an error. Is ready to send another request. |
| inAbort | string | The hook is canceling the request. |
| canceled | string | The hook canceled the request. Is ready to send another request. |
| data | Response | The received response. You can parse using json() function |
| error | any | Information about the catched error. |



### Example:  

    import React,  {  useEffect  }  from  "react";
    import useAPIHook from  "react-api-hook";

    function  App()  {
	    const  [status,  send,  cancel]  =  useAPIHook(
		    "https://jsonplaceholder.typicode.com/posts",
		    {  method:  "GET"  },
	    );
	    
	    useEffect(()  =>  {
		    if (status.status  ===  "success") {
			    console.log(status.data);
			    //status.data.json() for the body of response  
		    }
		    if(status.status  ===  "failure") {
			    console.log(status.error);
		    }
	    }, [status]);
	    
	    return (
		    <div  className="App">
				<header  className="App-header">
					<div>{status.status}</div>
				    <div>
					    <button  onClick={send}>start fetching</button>
					    <button  onClick={cancel}>stop fetching</button>
				    </div>
				</header>
		    </div>
	    );
    }
    
    export  default  App;