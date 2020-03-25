import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs/internal/observable/merge';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import { fade } from '../../animations/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tipo } from 'src/app/models/tipo';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    fade
  ],
})

export class MainComponent implements OnInit, AfterViewInit {

  titulo = 'Mis Artículos';
  displayedColumns: string[] = ['nombre', 'tipo', 'fechaEntrada', 'fechaCaducidad', 'editar', 'eliminar'];
  exampleDatabase: ProductoService | null;
  dataSource: Producto[] = [];
  productos: Producto[] = null;
  tipos: Tipo[] = null;
  tipoId: number = 0;
  tipoNombre: string = null;
  public errores: any = null;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private productoService: ProductoService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.setearTipo();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.dataSource) {
      this.getProductosPage();
    }
  }

  setearTipo() {
    this.productoService.getTipos().subscribe(
      (resp) => {
        this.tipos = resp.slice();
        this.activatedRoute.params.subscribe(params => {
          this.tipoNombre = params.tipo;
          if (params.tipo) {
            const tiposAux = [...resp];
            const arrId = tiposAux.filter(x => this.formatTipoNombre(x.nombre) === this.tipoNombre);
            if (arrId.length > 0) {
              this.tipoId = arrId[0].id;
            }
            if (this.tipoId < 1) {
              this.router.navigate(['/productos']);
            }
            this.titulo = this.generarTitulo(this.tipoId);
            this.getProductosPage();
          }
        });
      });
  }

  getProductosPage() {
    this.exampleDatabase = new ProductoService(this.http);
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase.getProductosCustomPagePorTipo(
            this.tipoId,
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalElements;
          return data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource = data);
  }

  deleteProducto(id: number) {
    this.productoService.delete(id).subscribe(
      resp => {
        this.resultsLength = 0;
        this.isLoadingResults = true;
        this.isRateLimitReached = false;
        this.snackBar.open(resp.mensaje, 'OK', {
          duration: 4000,
        });
        return this.getProductosPage();
      }, err => {
        this.errores = err.error;
        this.snackBar.open(this.errores.mensaje, 'OK', {
          duration: 4000,
        });
      }
    );
  }

  fechaCaducada(fecha: any) {
    const today = new Date();
    const vencimiento = new Date(Date.parse(fecha));
    return today >= vencimiento;
  }

  fechaPorCaducar(fecha: any) {
    const today = new Date();
    const vencimiento = new Date(Date.parse(fecha));
    const fechaPorVencer = new Date(Date.parse(fecha));
    fechaPorVencer.setMonth(fechaPorVencer.getMonth() - 6);
    return fechaPorVencer <= today && vencimiento > today;
  }

  // Convierte los espacios en guión y borra los acentos.
  formatTipoNombre(str: string) {
    return str.toLowerCase().replace(/ /g, '-')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  generarTitulo(tipoId: any) {
    const base = 'Mis Artículos';
    if (tipoId >0) {
      return `${base} - ${this.tipos[tipoId - 1].nombre}`;
    }
    return base;
  }


}
