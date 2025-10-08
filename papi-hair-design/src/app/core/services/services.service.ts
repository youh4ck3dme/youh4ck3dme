import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import servicesData from '../../data/services.json';
import { Service } from '../../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private readonly services = servicesData as Service[];

  getAll(): Observable<Service[]> {
    return of(this.services);
  }

  getById(id: string): Observable<Service | undefined> {
    return of(this.services.find((item) => item.id === id));
  }

  search(term: string): Observable<Service[]> {
    const normalized = term.toLowerCase();
    return of(
      this.services.filter(
        (service) =>
          service.name.toLowerCase().includes(normalized) ||
          service.description.toLowerCase().includes(normalized) ||
          service.category.toLowerCase().includes(normalized),
      ),
    );
  }
}
