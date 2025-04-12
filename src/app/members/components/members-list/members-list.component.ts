import {Component, DestroyRef, inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {Member} from '../../member.interface';
import {MembersService} from '../../members.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatSort, MatSortable, MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {MemberItemComponent} from '../member-item/member-item.component';

@Component({
  selector: 'ltrc-members-list',
  imports: [CommonModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss'
})
export class MembersListComponent implements OnInit {

  destroyRef = inject(DestroyRef);

  displayedColumns: string[] = ['lastName', 'name', 'dni', 'actions'];
  dataSource = new MatTableDataSource<Member>();
  totalMembers: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  query = '';

  member!: Member;

  readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;


  constructor(private membersService: MembersService) {
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.sort.sort(({id: 'lastName', start: 'asc'}) as MatSortable)
    this.dataSource.sort = this.sort;

    this.sort.sortChange.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.loadMembers();
    });

    this.loadMembers();
  }

  loadMembers(): void {

    this.membersService.getMembers(this.query, this.currentPage, this.pageSize, this.sort?.active, this.sort?.direction).pipe(
      takeUntilDestroyed(this.destroyRef))
      .subscribe(response => {
        this.dataSource.data = response.data;
        this.totalMembers = response.total;
        this.paginator.length = this.totalMembers;
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadMembers();
  }

  applyFilter() {
    this.loadMembers();
  }

  clearFilter() {
    this.query = '';
    this.loadMembers();
  }

  createMember() {
    console.log('createMember');
    this.dialog.open(MemberItemComponent, {
      width: '90vw',
      maxWidth: '500px',
      data: null, // o no pasar nada
    });
  }

  editMember(member: Member) {
    const dialogRef = this.dialog.open(MemberItemComponent, {
      width: '90vw',
      maxWidth: '500px',
      data: member,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.membersService.updateMember(member._id, result).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() =>
          this.loadMembers()
        )
        ;
      }
    });
  }
}
