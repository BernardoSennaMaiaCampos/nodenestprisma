@IsOptional()
@IsIn(['user', 'admin'], {
  message: 'role deve ser "user" ou "admin"',
})
role?: string;

