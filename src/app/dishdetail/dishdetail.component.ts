import { Component, OnInit,Input, Inject  } from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

import { trigger, state, style, animate, transition } from '@angular/animations';

import { visibility } from '../animations/app.animation';
import { flyInOut,expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
  visibility(),
  flyInOut(),
  expand()
  ],
  
})


export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess:string;
  dishIds: string[];
  prev: string;
  next: string;
  dishcopy: Dish;
  visibility = 'shown';
  dishfeedbackform: FormGroup;

  dishComment: Comment;


  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',
    }
  };


  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject ('BaseURL') private BaseURL) { }

    ngOnInit() {
      this.createForm();
      
      this.dishComment = new Comment();
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
      
    }
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }  

  createForm() {

    this.dishfeedbackform = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: 5,
      comment: ''
    });

    this.dishfeedbackform.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {

    if (!this.dishfeedbackform) {

      return;
    }

    const form = this.dishfeedbackform;
    for (const field in this.formErrors) {

      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }

  }

  onSubmit() {

    if (this.dishfeedbackform.value) {

      this.dishComment.author = this.dishfeedbackform.value.author;
      this.dishComment.date = new Date().toISOString();
      this.dishComment.comment = this.dishfeedbackform.value.comment;
      this.dishComment.rating = this.dishfeedbackform.value.rating;

      // this.dish.comments.push(this.dishComment);
      this.dishcopy.comments.push(this.dishComment);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    }
     
    

    this.dishfeedbackform.reset({
      author: '',
      rating: 5,
      comment: ''
    });
  }
  goBack(): void {
    this.location.back();
  }

}