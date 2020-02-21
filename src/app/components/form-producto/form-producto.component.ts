import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fade } from 'src/app/animations/animations';
import { Tipo } from 'src/app/models/tipo';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html',
  styleUrls: ['./form-producto.component.scss'],
  animations: [
    fade
  ],
})

export class FormProductoComponent implements OnInit, AfterViewInit {

  titulo = 'Agregar nuevo producto';
  producto: Producto = new Producto();
  tipos: Tipo[];
  public errores: any;

  @ViewChild('inputnombre', { static: false }) inputNombre: ElementRef;

  formGroup: FormGroup = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(40)
    ]),
    id: new FormControl('', []),
    tipo: new FormControl('', [
      Validators.required
    ]),
    fechaEntrada: new FormControl('', [
      Validators.required
    ]),
    fechaCaducidad: new FormControl('', [
      Validators.required
    ]),
    descripcion: new FormControl('', [
      Validators.maxLength(500)
    ]),
  });

  get id() {
    return this.formGroup.controls.id;
  }
  get nombre() {
    return this.formGroup.controls.nombre;
  }
  get tipo() {
    return this.formGroup.controls.tipo;
  }
  get fechaEntrada() {
    return this.formGroup.controls.fechaEntrada;
  }
  get fechaCaducidad() {
    return this.formGroup.controls.fechaCaducidad;
  }
  get descripcion() {
    return this.formGroup.controls.descripcion;
  }

  constructor(
    private productoService: ProductoService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarProducto();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputNombre.nativeElement.focus();
    });
  }

  cargarProducto() {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.productoService.getProducto(id).subscribe(
          (producto) => {
            this.producto = producto;
            this.titulo = 'Modificar producto';
            this.formGroup.setValue(this.producto);
          },
          err => {
            this.router.navigate(['/productos']);
          });
      }
    });
    this.productoService.getTipos().subscribe(
      (resp) => this.tipos = resp
    );
  }

  create() {
    this.productoService.create(this.formGroup.value).subscribe(
      resp => {
        this.snackBar.open(resp.mensaje, 'OK', {
          duration: 4000,
        });
        this.formGroup.reset();
        this.inputNombre.nativeElement.focus();
      },
      err => {
        this.gestionarError(err);
      });
  }

  update() {
    this.productoService.update(this.formGroup.value).subscribe(
      resp => {
        this.snackBar.open(resp.mensaje, 'OK', {
          duration: 4000,
        });
        this.formGroup.reset();
        this.inputNombre.nativeElement.focus();
      },
      err => {
        this.gestionarError(err);
      }
    );
  }

  compararTipo(o1: Tipo, o2: Tipo) {
    if (o1 === undefined && o2 === undefined) { return true; }
    return o1 == null || o2 == null ? false : o1.id === o2.id;
  }

  gestionarError(err: any) {
    if (err.status === 400) {
      this.errores = err.error.errores;
      console.log(err);
      console.log(this.errores);
      this.snackBar.open('Error :(', 'OK', {
        duration: 4000,
      });
      return;
    }
    this.snackBar.open(err.mensaje, 'OK', {
      duration: 4000,
    });
  }

}
