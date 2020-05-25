import * as React from 'react';
import './App.css';
import TodoList from './TodoList';
import SpeechRecognitionService from './speechRecognitionService';
import SpeechProcessorService from './speechProcessorService';

interface State {
  recording: boolean;
  result?: string;
  todos: Todo[];
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

let todoId = 0;

class App extends React.Component<{} | undefined, State> {
  recognition: SpeechRecognitionService;
  processor: SpeechProcessorService;
  input: HTMLInputElement | null;

  constructor(props?: {}) {
    super(props);
    this.state = { recording: false, todos: [] };
    this.recognition = new SpeechRecognitionService();
    this.processor = new SpeechProcessorService(this.state.todos);
    this.processor.addTodoHandler = this.addTodo;
    this.processor.toggleTodoHandler = this.toggle;
  }

  componentDidMount() {
    this.input!.focus();
  }

  startRecording = () => {
    this.recognition.onResult((result, isFinal) => {
      if (isFinal) {
        this.processor.process(result);
      }
      this.setState({ result });
    });
    this.recognition.onEnd(() => {
      this.setState({ recording: false });
    });
    this.recognition.start();
    this.setState({ recording: true });
  }

  stopRecording = () => {
    this.setState({ recording: false });
    this.recognition.stop();
  }

  toggleRecording = () => {
    this.state.recording ? this.stopRecording() : this.startRecording();
  }

  addTodo = (text: string) => {
    const todo = { id: todoId++, text: text, completed: false };
    const todos = [...this.state.todos, todo];
    this.setState({ todos });
    this.input!.value = '';
    this.input!.focus();
    return todos;
  }

  toggle = (updatedTodo: Todo) => {
    const updatedTodos = this.state.todos.map(todo => {
      return (todo !== updatedTodo) ? todo : {
        ...todo,
        completed: !todo.completed,
      };
    });
    this.setState({ todos: updatedTodos });
    return updatedTodos;
  }

  render() {
    return (
      <div>
        <header className="App-header">Principal Inclusion....</header>
        <h1 className="App-h1">Kindness is the language which the deaf can hear and the blind can see.</h1>
        <div className="App">
<button className="button1" onClick={this.toggleRecording}>{this.state.recording ? 'Stop' : 'Start'} Recording</button>
          {this.state.result && <p className="impact">Transcript: {this.state.result}</p>}
          <form onSubmit={event => { this.addTodo(this.input!.value); event.preventDefault(); }}>
            <input ref={node => this.input = node} type="hidden"/>
            {/* <button  className="button1" type="submit">Add</button> */}
          </form>
          <TodoList todos={this.state.todos} onToggle={this.toggle} />
        </div>
      </div>
      
    );
  }
}

export default App;
