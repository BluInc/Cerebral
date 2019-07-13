import React from 'react';
import './App.css';

import ChatBot from 'react-simple-chatbot';
import questionsJson from './questions.json';

var results = [];

var i;
var id_iter = 1;
for (i = 1; i < questionsJson.length; i++) {
  var obj = questionsJson[i];

  results.push({
    id: id_iter,
    message: obj.question,
    trigger: id_iter+1
  });

  id_iter++;

  if (typeof obj.validation === 'object') {
    var opts = [];
    var j;

    if (typeof obj.paths === 'object') {
      for (j = 0; j < obj.validation.length; j++) {
        opts.push({
          value: obj.validation[j],
          label: obj.validation[j],
          trigger: ((obj.paths[obj.validation[j]] === -1) ? -1 : obj.paths[obj.validation[j]]*2-1)
        })
      }
  
    } else {
      for (j = 0; j < obj.validation.length; j++) {
        opts.push({
          value: obj.validation[j],
          label: obj.validation[j],
          trigger: obj.paths*2-1
        })
      }
    }

    results.push({
      id: id_iter,
      options: opts
    });

  } else if (typeof obj.validation === 'string') {
    const regex = obj.validation.slice(0);
    results.push({
      id: id_iter,
      user: true,
      validator: (str) => {
        var patt = new RegExp(regex);
        
        if(patt.test(str)) {
          return true;
        } else {
          return 'Try again please!';
        }
      },
      trigger: id_iter+1
    });

  } else { // obj.validation === 'boolean'
    if (obj.validation) {
      results.push({
        id: id_iter,
        user: true,
        trigger: id_iter+1
      });
    } else {
      id_iter--;
      var revised_step = results.pop();
      revised_step.end = true;
      delete revised_step.trigger;
      results.push(revised_step);
    }
  }

  id_iter++;
}

console.log(results);

// append catch all -1 to end
results.push({
  id: -1,
  message: questionsJson[0].question,
  end: true
})

const steps = results;

function App() {
  return (
    <div className="App">
      <ChatBot steps={steps} />
    </div>
  );
}

export default App;
