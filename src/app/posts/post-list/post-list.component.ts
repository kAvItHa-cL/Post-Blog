import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { templateJitUrl } from '@angular/compiler';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(public postService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService
      .getPostsUpdatedListener().subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);

  }


  OnDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId)
      .subscribe(() => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      });
  }


  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
