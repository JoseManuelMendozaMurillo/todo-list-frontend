import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export interface Todo {
  id?: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  audioUrl?: string;
  isCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) { }

  private formatImageUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;
    return `${environment.apiUrl}${url}`;
  }

  private formatAudioUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;
    return `${environment.apiUrl}${url}`;
  }

  private formatTodoUrls(todo: Todo): Todo {
    return {
      ...todo,
      imageUrl: this.formatImageUrl(todo.imageUrl),
      audioUrl: this.formatAudioUrl(todo.audioUrl)
    };
  }

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      map(todos => todos.map(todo => this.formatTodoUrls(todo)))
    );
  }

  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      map(todo => this.formatTodoUrls(todo))
    );
  }

  createTodo(todo: FormData): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      map(todo => this.formatTodoUrls(todo))
    );
  }

  updateTodo(id: number, todo: FormData): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo).pipe(
      map(todo => this.formatTodoUrls(todo))
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleComplete(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {}).pipe(
      map(todo => this.formatTodoUrls(todo))
    );
  }
} 