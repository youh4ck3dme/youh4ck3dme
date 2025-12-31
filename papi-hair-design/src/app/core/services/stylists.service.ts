import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import stylistsData from '../../data/stylists.json';
import { Stylist } from '../../models/stylist.model';

@Injectable({ providedIn: 'root' })
export class StylistsService {
  private readonly stylists = stylistsData as Stylist[];

  getAll(): Observable<Stylist[]> {
    return of(this.stylists);
  }

  getById(id: string): Observable<Stylist | undefined> {
    return of(this.stylists.find((item) => item.id === id));
  }

  search(term: string): Observable<Stylist[]> {
    const normalized = term.toLowerCase();
    return of(
      this.stylists.filter((stylist) =>
        `${stylist.name} ${stylist.bio} ${stylist.skills.join(' ')}`
          .toLowerCase()
          .includes(normalized),
      ),
    );
  }
}
