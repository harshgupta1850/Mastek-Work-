console.log('hi');

var template= React.createElement(
    'p',
    {id : "someId"},
    "something new"
)
    

var appRoot=document.getElementById('app');

ReactDOM.render(template,appRoot)

