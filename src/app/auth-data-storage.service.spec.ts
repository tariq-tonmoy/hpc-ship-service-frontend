import { TestBed } from '@angular/core/testing';

import { AuthDataStorageService } from './auth-data-storage.service';

describe('AuthDataStorageService', () => {
  let service: AuthDataStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthDataStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
