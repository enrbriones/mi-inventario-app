import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Producto } from '../models/producto';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError, tap } from 'rxjs/operators';
import { PageParams } from '../models/pageParams';
import { Tipo } from '../models/tipo';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url = 'http://localhost:8080/api/productos';

  constructor(
    private http: HttpClient
  ) { }

  getProductos(page: number): Observable<any> {
    return this.http.get(this.url + '/page/' + page).pipe(
      map((resp: any) => {
        (resp.content as Producto[]).map(producto => {
          producto.nombre = producto.nombre.toUpperCase();
          return producto;
        });
        console.log('entró');
        return resp;
      })
    );
  }

  getProductosCustomPage(page: number, size: number): Observable<any> {
    const parametros: PageParams = new PageParams(null, page, size);

    return this.http.post(this.getUrl(this.url, 'custom'), parametros).pipe(
      map((resp: any) => {
        (resp.content as Producto[]).map(producto => {
          producto.nombre = producto.nombre.toUpperCase();
          return producto;
        });
        return resp;
      })
    );
  }

  getProductosCustomPagePorTipo(tipoId: number, page: number, size: number): Observable<any> {
    const parametros: PageParams = new PageParams(tipoId, page, size);

    return this.http.post(this.getUrl(this.url, 'tipo'), parametros).pipe(
      map((resp: any) => {
        (resp.content as Producto[]).map(producto => {
          producto.nombre = producto.nombre.toUpperCase();
          return producto;
        });
        return resp;
      })
    );
  }

  getProducto(id: number): Observable<any> {
    return this.http.get<Producto>(this.url + '/' + id).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  create(producto: Producto): Observable<any> {
    return this.http.post<Producto>(this.url + '/', producto).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(producto: Producto): Observable<any> {
    return this.http.put<Producto>(this.getUrl(this.url, producto.id), producto).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<Producto>(this.getUrl(this.url, id))
      .pipe(
        catchError(e => {
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

  getTipos() {
    return this.http.get<Tipo[]>(this.getUrl(this.url, 'tipos'));
  }

  getUrl(url: string, ...params: any[]) {
    const str = params.map(x => x.toString().trim()).join('/');
    return str.length > 0 ? `${url}/${str}/` : `${url}/`;
  }

}
