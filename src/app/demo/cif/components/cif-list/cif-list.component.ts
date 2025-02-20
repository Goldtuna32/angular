import { Component, OnInit, ViewChild } from '@angular/core';
import { CifService } from '../../services/cif.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
 
export interface CIF {
  id: number;
  name: string;
  nrcNumber: string;
  dob: string;
  phoneNumber: string;
  email: string;
}

@Component({
  selector: 'app-cif-list',
  imports: [ CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressSpinnerModule ],
  templateUrl: './cif-list.component.html',
  styleUrl: './cif-list.component.scss'
})

export class CifListComponent implements OnInit{
  displayedColumns: string[] = ['id', 'name', 'nrcNumber', 'dob', 'phoneNumber', 'email', 'actions'];
  dataSource = new MatTableDataSource<CIF>([]);
  loading = true;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cifService: CifService, private router: Router) {}

  ngOnInit(): void {
    this.loadCIFs();
  }

  loadCIFs() {
    this.cifService.getAllCIFs().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load CIFs.';
        console.error('Error fetching CIFs:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editCIF(id: number) {
    this.router.navigate(['/cifs/edit', id]);
  }

  deleteCIF(id: number) {
    if (confirm('Are you sure you want to delete this CIF?')) {
      this.cifService.deleteCIF(id).subscribe({
        next: () => {
          alert('CIF deleted successfully.');
          this.loadCIFs();
        },
        error: (error) => {
          alert('Failed to delete CIF.');
          console.error('Error deleting CIF:', error);
        }
      });
    }
  }
}
