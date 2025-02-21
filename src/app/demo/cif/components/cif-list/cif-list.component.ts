import { Component, OnInit, ViewChild } from '@angular/core';
import { CifService } from '../../services/cif.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CifEditComponent } from '../cif-edit/cif-edit.component';
import { MatDialog } from '@angular/material/dialog';
 
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
  standalone: true,
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

  constructor(private cifService: CifService, private router: Router, private dialog: MatDialog) {}

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

  editCIF(cif: CIF) {
    const dialogRef = this.dialog.open(CifEditComponent, {
      width: '400px',
      data: { ...cif } // Pass a copy to avoid modifying the original object before saving
    });
  
    dialogRef.afterClosed().subscribe(updatedCif => {
      if (updatedCif) {
        // Send update request to the backend
        this.cifService.updateCIF(updatedCif).subscribe({
          next: () => {
            // Update the local data after successful update
            const index = this.dataSource.data.findIndex(item => item.id === updatedCif.id);
            if (index !== -1) {
              this.dataSource.data[index] = updatedCif;
              this.dataSource._updateChangeSubscription(); // Refresh table
            }
            alert('CIF updated successfully!');
          },
          error: (error) => {
            alert('Failed to update CIF.');
            console.error('Error updating CIF:', error);
          }
        });
      }
    });
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
