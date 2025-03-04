import { Trash } from '@phosphor-icons/react'
import { Header } from './components/Header'
import { PlusCircle } from '@phosphor-icons/react/dist/ssr'
import styles from "./App.module.css"
import clipboard from "./assets/clipboard.svg";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from 'react'
import { UUIDTypes, v4 as uuidv4 } from 'uuid';

interface Task {
  id: UUIDTypes,
  content: string,
  isCompleted: boolean
}

function App() {
  const [newTaskInput, setNewTaskInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);

  function handleNewTaskChange(event: ChangeEvent<HTMLInputElement>) {
    setNewTaskInput(event.target.value);
    return;
  }

  function handleNewTaskSubmit(event: FormEvent) {
    event.preventDefault();

    if(newTaskInput.trim().length <= 3) {
      alert("Digite uma tarefa válida!");
      return;
    }

    const newList: Task[] = [
      ...tasks, {
        id: uuidv4(),
        content: newTaskInput,
        isCompleted: false
      }
    ]

    setTasks(newList);
    setNewTaskInput("");
  }

  function handleTaskCheckoxChange(event: ChangeEvent<HTMLInputElement>) {
    const taskId = event.target.id;

    const searchedTaskIndex = tasks.findIndex(task => task.id === taskId);
    tasks[searchedTaskIndex].isCompleted = !tasks[searchedTaskIndex].isCompleted;

    setTasks([...tasks]);
  }

  useEffect(() => {
    countCompletedTasks();

    function countCompletedTasks() {
      let completed = 0;
  
      tasks.map(task => {
        if(task.isCompleted) {
          completed = completed + 1;
        };
      });

      setCompletedTasks(completed);
    }
  }, [tasks]);

  function handleDelteTask(event: MouseEvent<HTMLButtonElement>) {
   const taskId = (event.target as HTMLButtonElement).dataset.id;

   const newTasksList = tasks.filter(task => task.id !== taskId);

   setTasks(newTasksList);
  }


  return (
    <>
      <Header />

      <main className={styles.mainContainer}>
        <form onSubmit={handleNewTaskSubmit} className={styles.addTaskForm}>
          <input onChange={handleNewTaskChange} value={newTaskInput} placeholder="Adicione uma nova tarefa" type="text" />
          <button type="submit">
            Criar
            <PlusCircle size={24} />
          </button>
        </form>
        
        <div>
          <div className={styles.tasksStatus}>
            <div>
              <p>Tarefas Criadas</p>
              <span>{tasks.length}</span>
            </div>

            <div>
              <p>Concluídas</p>
              <span>{ completedTasks } </span>
            </div>
          </div>

          {
            tasks.length > 0 ?
            <ul className={styles.tasksList}>
              {
                tasks.map((task: Task) => (
                  <li key={`${task.id}`}>
                    <input onChange={handleTaskCheckoxChange} id={`${task.id}`} type='checkbox' value={`${task.id}`} name="tasks[]" />

                    <div>
                      <label htmlFor={`${task.id}`} className="checkbox"></label>
                      <p>{task.content}</p>
                    </div>

                    <button onClick={handleDelteTask} data-id={`${task.id}`}>
                      <Trash size={24} />
                    </button>
                  </li>

                ))
              }
            </ul>
            :
            <div className={styles.emptyContent}>
              <img src={clipboard} />

              <h2>Você ainda não tem tarefas cadastradas</h2>
              <p>Crie tarefas e organize seus itens a fazer</p>
            </div>
          }
        </div>
      </main>
    </>
  )
}

export default App
