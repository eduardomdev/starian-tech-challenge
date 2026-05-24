import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { email, form, FormField, FormRoot, maxLength, required } from '@angular/forms/signals';
import { DialogService } from 'primeng/dynamicdialog';

import { StrInputComponent } from '@shared/components/atoms/inputs/str-input/str-input.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { StrAvatarComponent } from '@shared/components/atoms/avatar/avatar';
import { TagComponent } from '@shared/components/atoms/str-tag/str-tag';
import { ProfileSkeletonComponent } from './profile-skeleton';
import { ConfirmModalComponent, type ConfirmModalData } from '@shared/components/molecules/confirm-modal/confirm-modal.component';
import { UserService } from '@shared/services/user.service';
import { UserIntegrationService } from '../../services/user-integration/user-integration.service';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import { USER_ROLE_TAG_CONFIG } from '@core/constants/tag-user.constant';
import type { UpdateUserPayload } from '@shared/interfaces/user.interface';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormRoot,
    FormField,
    StrInputComponent,
    StrButtonComponent,
    IconComponent,
    StrAvatarComponent,
    TagComponent,
    ProfileSkeletonComponent,
  ],
})
export class ProfilePageComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly integrationService = inject(UserIntegrationService);
  private readonly dialogService = inject(DialogService);
  private readonly toastr = inject(ToastrService);

  protected readonly loading = computed(() => this.userService.currentUser.isLoading());
  protected readonly loadError = computed(() => this.userService.currentUser.error() !== undefined);
  protected readonly user = computed(() => this.userService.currentUser.value());

  protected readonly updateLoading = this.integrationService.updateProfileLoading;
  protected readonly roleTagConfig = signal(USER_ROLE_TAG_CONFIG);

  protected readonly profileModel = signal<UpdateUserPayload>({
    username: '',
    email: '',
    password: '',
  });

  protected readonly profileForm = form(
    this.profileModel,
    (p) => {
      required(p.username, { message: 'Usuário é obrigatório.' });
      maxLength(p.username, 30, { message: 'Usuário pode ter no máximo 30 caracteres.' });
      required(p.email, { message: 'E-mail é obrigatório.' });
      email(p.email, { message: 'Informe um e-mail válido.' });
      maxLength(p.email, 100, { message: 'E-mail pode ter no máximo 100 caracteres.' });
      required(p.password, { message: 'Senha é obrigatória.' });
      maxLength(p.password, 64, { message: 'Senha pode ter no máximo 64 caracteres.' });
    },
    {
      submission: {
        action: async (f) => {
          const currentUser = this.user();
          if (!currentUser) return;
          this.integrationService.updateProfile(currentUser.id, f().value(), () => {
            this.userService.currentUser.reload();
          });
        },
        onInvalid: () => {
          this.toastr.error('Por favor, corrija os erros no formulário.');
        },
      },
    },
  );

  constructor() {
    effect(() => {
      const userData = this.user();
      if (userData) {
        this.profileModel.set({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        });
      }
    });
  }

  ngOnInit(): void {
    this.userService.currentUser.reload();
  }

  protected openDeleteModal(): void {
    const currentUser = this.user();
    if (!currentUser) return;

    this.dialogService.open(ConfirmModalComponent, {
      width: '420px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
      data: {
        title: 'Excluir conta',
        description: 'Deseja realmente excluir sua conta? Esta ação não poderá ser desfeita.',
        confirmLabel: 'Excluir conta',
        loading: this.integrationService.deleteAccountLoading,
        onConfirm: (close) => this.integrationService.deleteAccount(currentUser.id, close),
      } satisfies ConfirmModalData,
    });
  }
}
