import * as React from 'react';
import { Todo } from './App';
import './App.css';
interface Props {
  todos: Todo[];
  onToggle: (todo: Todo) => void;
}

export default class TodoList extends React.Component<Props> {
  render() {
    const { todos } = this.props;
    return (
      <ul className="impact">
      {todos.map(todo => {
        return (<li className="impact" key={todo.id}>
          <input className="impact" type="checkbox" onClick={() => this.props.onToggle(todo)} checked={todo.completed} /> {todo.text}
        </li>);
      })}
      </ul>
    );
  }
}
