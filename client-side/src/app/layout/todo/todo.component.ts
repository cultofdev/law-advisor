import { Component, OnDestroy, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Subject, takeUntil } from 'rxjs';
import { TodoService } from 'src/app/shared/services/todo.service';
import { UrlEndpoint } from 'src/app/shared/util/url-endpoint';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

export class ToDo {
  public _id!: string;
  public user_id!: string;
  public status!: string;
  public title!: string;
  public description!: string;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  public todoList: ToDo[] = [];
  public startedList: ToDo[] = [];
  public forTestingList: ToDo[] = [];
  public completedList: ToDo[] = [];

  public isDialogVisible = false;
  public isEdit = false;

  public todoForm!: FormGroup;

  constructor(
    public toDo: ToDo,
    private todoService: TodoService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      _id: [''],
      user_id: [''],
      status: [''],
      title: ['', Validators.compose([
        Validators.required
      ])],
      description: ['', Validators.compose([
        Validators.required
      ])],
    });

    this.retrieve();
  }

  retrieve() {
    const params = {
      userId: localStorage.getItem('userId')
    };

    this.todoService.get(UrlEndpoint.TODO, params).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (result) => {
        const data = Object.assign(result);

        if(data.length > 0) {
          this.segregateList(data);
        } else {
          this.showWarning();

          this.todoList = [];
          this.startedList = [];
          this.forTestingList = [];
          this.completedList = [];
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  create(todo: ToDo) {
    const data = {
      user_id: localStorage.getItem('userId'),
      status: 'todo',
      title: todo.title,
      description: todo.description
    };

    this.todoService.post(UrlEndpoint.TODO, data).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      complete: () => {
        this.showSuccess('create');
        this.isDialogVisible = false;
        this.retrieve();
        this.todoForm.reset();
      },
      error: () => this.showError('create')
    });
  }

  update(todo: ToDo) {
    this.todoService.put(UrlEndpoint.TODO, todo).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      complete: ()=> {
        this.showSuccess('update');
        this.retrieve();
        this.isDialogVisible = false;
      },
      error: () => this.showError('update')
    });
  }

  delete(id: string) {
    const params = {
      _id: id
    };

    this.todoService.delete(UrlEndpoint.TODO, params).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      complete: () => {
        this.showSuccess('delete');
        this.retrieve();
      },
      error: (err) => console.log(err)
    });
  }

  edit(todo: ToDo) {
    this.todoForm.setValue({
      _id: todo._id,
      user_id: todo.user_id,
      status: todo.status,
      title: todo.title,
      description: todo.description
    });

    this.isDialogVisible = true;
    this.isEdit = true;
  }

  updateStatus(todo: any, destination: string) {
    const statusMap = new Map();

    statusMap.set('cdk-drop-list-0', 'todo');
    statusMap.set('cdk-drop-list-1', 'started');
    statusMap.set('cdk-drop-list-2', 'testing');
    statusMap.set('cdk-drop-list-3', 'completed');

    this.toDo = {
      _id: todo._id,
      user_id: todo.user_id,
      status: statusMap.get(destination),
      title: todo.title,
      description: todo.description
    };

    this.update(this.toDo);
  }

  drop(event: CdkDragDrop<ToDo[]>) {
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.updateStatus(event.item.data, event.container.id);

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  segregateList(data: any) {
    this.todoList = data.filter((x: { status: string; }) => x.status === 'todo');
    this.startedList = data.filter((x: { status: string; }) => x.status === 'started');
    this.forTestingList = data.filter((x: { status: string; }) => x.status === 'testing');
    this.completedList = data.filter((x: { status: string; }) => x.status === 'completed');
  }

  showSuccess(type: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success!',
      detail: this.getSuccessDescription(type),
      life: 4000
    });
  }

  showWarning() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning!',
      detail: 'No data retrieved..',
      life: 4000
    });
  }

  showError(action: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error!',
      detail: this.getErrorDescription(action),
      life: 4000
    });
  }

  getSuccessDescription(type: string) {
    let description;

    switch (type) {
      case 'create':
        description = 'Successfully created a record.';
        break;
      case 'update':
        description = 'Successfully updated record.';
        break;
      case 'delete':
        description = 'Successfully deleted record.';
        break;
      default:
        break;
    }

    return description;
  }

  getErrorDescription(type: string) {
    let description;

    switch (type) {
      case 'create':
        description = 'An error occurred while creating a record.';
        break;
      case 'retrieve':
        description = 'An error occurred while retrieving records.';
        break;
      case 'update':
        description = 'An error occurred while updating a record.';
        break;
      case 'delete':
        description = 'An error occurred while deleting a record.';
        break;
      default:
        break;
    }

    return description;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
