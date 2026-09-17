import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BOARD_FILE = path.join(DATA_DIR, 'launch_board.json');

function getTasks() {
  if (!fs.existsSync(BOARD_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(BOARD_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveTasks(tasks: any[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(BOARD_FILE, JSON.stringify(tasks, null, 2));
}

export async function GET() {
  const tasks = getTasks();
  
  const total = tasks.length;
  const completed = tasks.filter((t: any) => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter((t: any) => t.status === 'IN_PROGRESS' || t.status === 'TESTING').length;
  const todo = tasks.filter((t: any) => t.status === 'TODO').length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return NextResponse.json({
    tasks,
    stats: {
      total,
      completed,
      inProgress,
      todo,
      progressPercent
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, task, taskId, status, checklistId, done } = body;
    let tasks = getTasks();

    if (action === 'CREATE') {
      const newTask = {
        id: 'task-' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'TODO',
        checklist: [],
        ...task
      };
      tasks.unshift(newTask);
      saveTasks(tasks);
      return NextResponse.json({ success: true, task: newTask, tasks });
    }

    if (action === 'MOVE') {
      const taskIndex = tasks.findIndex((t: any) => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].status = status;
        if (status === 'COMPLETED') {
          tasks[taskIndex].completedAt = new Date().toISOString();
        }
        saveTasks(tasks);
        return NextResponse.json({ success: true, task: tasks[taskIndex], tasks });
      }
    }

    if (action === 'TOGGLE_CHECKLIST') {
      const taskIndex = tasks.findIndex((t: any) => t.id === taskId);
      if (taskIndex !== -1 && tasks[taskIndex].checklist) {
        const itemIndex = tasks[taskIndex].checklist.findIndex((c: any) => c.id === checklistId);
        if (itemIndex !== -1) {
          tasks[taskIndex].checklist[itemIndex].done = done;
          
          // If all checklist items done, prompt or auto-complete
          const allDone = tasks[taskIndex].checklist.every((c: any) => c.done);
          if (allDone && tasks[taskIndex].status !== 'COMPLETED') {
            tasks[taskIndex].status = 'COMPLETED';
            tasks[taskIndex].completedAt = new Date().toISOString();
          }
          saveTasks(tasks);
          return NextResponse.json({ success: true, task: tasks[taskIndex], tasks });
        }
      }
    }

    if (action === 'DELETE') {
      tasks = tasks.filter((t: any) => t.id !== taskId);
      saveTasks(tasks);
      return NextResponse.json({ success: true, tasks });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
