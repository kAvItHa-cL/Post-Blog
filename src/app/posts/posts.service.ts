import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';




@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }



  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }


  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe((transformedPostsData) => {
        console.log(transformedPostsData);
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.maxPosts });
      });
  }



  getPost(postId: string) {
    return this.http.get<{ _id: string, title: string, content: string, creator: string }>('http://localhost:3000/api/posts/' + postId);
  }




  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content, creator: null };
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });

  }



  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content, creator: null };
    this.http.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }




  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);

  }

}
