import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { CurrentAccountComponent } from 'src/app/demo/current-account/components/current-account/current-account.component';
import { CurrentAccountService } from 'src/app/demo/current-account/services/current-account.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CifDetailModalComponent } from '../cif-detail-modal/cif-detail-modal.component';
 
export interface CIF {
  id: number;
  name: string;
  nrcNumber: string;
  dob: string; // Use string because JSON from API returns it as text
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  maritalStatus: string;
  occupation: string;
  incomeSource: string;
  createdAt: string;
  branchId: number;
  hasCurrentAccount: boolean;
  fNrcPhotoUrl: string; // Cloudinary Front NRC Image
  bNrcPhotoUrl: string;
}

@Component({
  selector: 'app-cif-list',
  standalone: true,
  imports: [ CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule ],
  templateUrl: './cif-list.component.html',
  styleUrl: './cif-list.component.scss'
})

export class CifListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'nrcNumber', 'dob', 'phoneNumber', 'email', 'actions'];
  dataSource = new MatTableDataSource<CIF>([]);
  loading = true;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cifService: CifService,
    private router: Router,
    private dialog: MatDialog,
    private currentAccountService: CurrentAccountService
  ) {}

  ngOnInit(): void {
    this.loadCIFs();
  }

  openCifDetailDialog(cif: CIF) {
    this.dialog.open(CifDetailModalComponent, {
      width: '600px',
      data: cif
    });
  }

  ngAfterViewInit(): void {
    // Ensure paginator & sorting are set after view initializes
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCIFs() {
    this.cifService.getAllCIFs().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        
        // Manually loop through CIFs to check for current account status
        data.forEach((cif, index) => {
          this.currentAccountService.hasCurrentAccount(cif.id).subscribe({
            next: (hasAccount) => {
              this.dataSource.data[index].hasCurrentAccount = hasAccount;
            },
            error: (error) => {
              console.error(`Error checking account for CIF ${cif.id}:`, error);
            }
          });
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching CIFs:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Ensure filter resets paginator to first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCIF(cif: CIF) {
    const dialogRef = this.dialog.open(CifEditComponent, {
      width: '400px',
      data: { ...cif }
    });

    dialogRef.afterClosed().subscribe(updatedCif => {
      if (updatedCif) {
        this.cifService.updateCIF(updatedCif).subscribe({
          next: () => {
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

  openCurrentAccountDialog(row: CIF) {
    const dialogRef = this.dialog.open(CurrentAccountComponent, {
      width: '400px',
      data: { cifId: row.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Current Account Created:', result);
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
