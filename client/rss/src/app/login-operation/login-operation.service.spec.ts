import { TestBed } from '@angular/core/testing';

import { LoginOperationService } from './login-operation.service';

describe('LoginOperationService', () => {
  let service: LoginOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
