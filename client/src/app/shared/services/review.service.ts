import { Injectable } from '@angular/core';
import {Review} from "../model/Review";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Mobile} from "../model/Mobile";
import {Review_User} from "../model/Review_User";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) {

  }

  addReview(modelName: string, score: number, text: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();
    body.set('modelName', modelName);
    body.set('score', score.toString());
    body.set('text', text);

    return this.http.post('http://localhost:5000/app/addReview', body, { headers: headers, withCredentials: true});
  }

  deleteReview(review: Review) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();
    body.set('userEmail', review.userEmail);
    body.set('modelName', review.modelName);

    return this.http.delete('http://localhost:5000/app/deleteReview', { headers: headers, body: body, withCredentials: true });
  }

  getReviewsByMobile(modelName: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.get<Review_User[]>('http://localhost:5000/app/getReviews/' + modelName, { headers: headers });
  }

  initReviews() {
    return this.http.post('http://localhost:5000/app/initReviews', {});
  }
}
