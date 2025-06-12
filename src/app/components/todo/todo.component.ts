import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from '../../services/todo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-center">Todo List</h1>
      
      <!-- Create Todo Form -->
      <div class="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">{{editingTodo ? 'Edit Task' : 'Create New Task'}}</h2>
        <form (ngSubmit)="onSubmit()" #todoForm="ngForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" [(ngModel)]="newTodo.title" name="title" 
                   class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea [(ngModel)]="newTodo.description" name="description" rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Image</label>
            <input type="file" (change)="onFileSelected($event, 'image')" accept="image/*"
                   class="mt-1 block w-full">
            <div *ngIf="editingTodo?.imageUrl" class="mt-2">
              <p class="text-sm text-gray-500">Current image:</p>
              <img [src]="editingTodo?.imageUrl" alt="Current image" class="h-20 w-20 object-cover rounded">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Audio</label>
            <input type="file" (change)="onFileSelected($event, 'audio')" accept="audio/*"
                   class="mt-1 block w-full">
            <div *ngIf="editingTodo?.audioUrl" class="mt-2">
              <p class="text-sm text-gray-500">Current audio:</p>
              <audio controls [src]="editingTodo?.audioUrl" class="w-full"></audio>
            </div>
          </div>
          <div class="flex space-x-4">
            <button type="submit" 
                    class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              {{editingTodo ? 'Update Task' : 'Create Task'}}
            </button>
            <button *ngIf="editingTodo" type="button" (click)="cancelEdit()"
                    class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Todo Lists -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Pending Todos -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Pending Tasks</h2>
          <div class="space-y-4">
            <div *ngFor="let todo of pendingTodos" class="border rounded-lg p-4">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-medium">{{todo.title}}</h3>
                  <p class="text-gray-600 mt-1">{{todo.description}}</p>
                  <div *ngIf="todo.imageUrl" class="mt-2">
                    <img [src]="todo.imageUrl" alt="Todo image" class="max-w-20 h-auto rounded">
                  </div>
                  <div *ngIf="todo.audioUrl" class="mt-2">
                    <audio controls [src]="todo.audioUrl"></audio>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button (click)="editTodo(todo)" 
                          class="text-blue-600 hover:text-blue-800">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button (click)="toggleComplete(todo)" 
                          class="text-green-600 hover:text-green-800">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button (click)="deleteTodo(todo.id!)" 
                          class="text-red-600 hover:text-red-800">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completed Todos -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Completed Tasks</h2>
          <div class="space-y-4">
            <div *ngFor="let todo of completedTodos" class="border rounded-lg p-4 bg-gray-50">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-medium line-through text-gray-500">{{todo.title}}</h3>
                  <p class="text-gray-500 mt-1 line-through">{{todo.description}}</p>
                  <div *ngIf="todo.imageUrl" class="mt-2">
                    <img [src]="todo.imageUrl" alt="Todo image" class="max-w-full h-auto rounded opacity-50">
                  </div>
                  <div *ngIf="todo.audioUrl" class="mt-2">
                    <audio controls [src]="todo.audioUrl"></audio>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button (click)="editTodo(todo)" 
                          class="text-blue-600 hover:text-blue-800">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button (click)="toggleComplete(todo)" 
                          class="text-yellow-600 hover:text-yellow-800">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                  <button (click)="deleteTodo(todo.id!)" 
                          class="text-red-600 hover:text-red-800">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: Todo = { isCompleted: false };
  editingTodo: Todo | null = null;
  selectedImage?: File;
  selectedAudio?: File;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  get pendingTodos(): Todo[] {
    return this.todos.filter(todo => !todo.isCompleted);
  }

  get completedTodos(): Todo[] {
    return this.todos.filter(todo => todo.isCompleted);
  }

  loadTodos() {
    this.todoService.getAllTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
      }
    });
  }

  onSubmit() {
    const formData = new FormData();
    if (this.newTodo.title) formData.append('title', this.newTodo.title);
    if (this.newTodo.description) formData.append('description', this.newTodo.description);
    if (this.selectedImage) formData.append('image', this.selectedImage);
    if (this.selectedAudio) formData.append('audio', this.selectedAudio);

    if (this.editingTodo) {
      // Update existing todo
      this.todoService.updateTodo(this.editingTodo.id!, formData).subscribe({
        next: (updatedTodo) => {
          const index = this.todos.findIndex(t => t.id === this.editingTodo?.id);
          if (index !== -1) {
            this.todos[index] = updatedTodo;
          }
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating todo:', error);
        }
      });
    } else {
      // Create new todo
      this.todoService.createTodo(formData).subscribe({
        next: (todo) => {
          this.todos.push(todo);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating todo:', error);
        }
      });
    }
  }

  editTodo(todo: Todo) {
    this.editingTodo = { ...todo };
    this.newTodo = { ...todo };
    this.selectedImage = undefined;
    this.selectedAudio = undefined;
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.editingTodo = null;
    this.newTodo = { isCompleted: false };
    this.selectedImage = undefined;
    this.selectedAudio = undefined;
  }

  onFileSelected(event: Event, type: 'image' | 'audio') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (type === 'image') {
        this.selectedImage = file;
      } else {
        this.selectedAudio = file;
      }
    }
  }

  toggleComplete(todo: Todo) {
    this.todoService.toggleComplete(todo.id!).subscribe({
      next: (updatedTodo) => {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
      },
      error: (error) => {
        console.error('Error toggling todo completion:', error);
      }
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos = this.todos.filter(todo => todo.id !== id);
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
      }
    });
  }
} 