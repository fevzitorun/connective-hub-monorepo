import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { User } from '../../users/entities/user.entity'

/**
 * JwtAuthGuard'dan SONRA uygulanır.
 * E-postası doğrulanmamış kullanıcıların ilan oluşturma, ödeme vb.
 * aksiyonlarını engellemek için kullanılır.
 */
@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    const user: User = req.user
    if (!user) return false
    if (!user.isVerified) {
      throw new ForbiddenException(
        'Bu işlemi gerçekleştirmek için e-posta adresinizi doğrulamanız gerekiyor.',
      )
    }
    return true
  }
}
