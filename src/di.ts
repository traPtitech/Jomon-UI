import type { useAccountManagerRepository } from '@/features/accountManager/data/repository'
import type { useApplicationRepository } from '@/features/application/data/repository'
import type { usePartitionRepository } from '@/features/partition/data/repository'
import type { usePartitionGroupRepository } from '@/features/partitionGroup/data/repository'
import type { useTagRepository } from '@/features/tag/data/repository'
import type { useUserRepository } from '@/features/user/data/repository'
import type { InjectionKey } from 'vue'

export type UserRepository = ReturnType<typeof useUserRepository>
export type ApplicationRepository = ReturnType<typeof useApplicationRepository>
export type PartitionRepository = ReturnType<typeof usePartitionRepository>
export type PartitionGroupRepository = ReturnType<
  typeof usePartitionGroupRepository
>
export type TagRepository = ReturnType<typeof useTagRepository>
export type AccountManagerRepository = ReturnType<
  typeof useAccountManagerRepository
>

export const UserRepositoryKey: InjectionKey<UserRepository> =
  Symbol('UserRepository')
export const ApplicationRepositoryKey: InjectionKey<ApplicationRepository> =
  Symbol('ApplicationRepository')
export const PartitionRepositoryKey: InjectionKey<PartitionRepository> = Symbol(
  'PartitionRepository'
)
export const PartitionGroupRepositoryKey: InjectionKey<PartitionGroupRepository> =
  Symbol('PartitionGroupRepository')
export const TagRepositoryKey: InjectionKey<TagRepository> =
  Symbol('TagRepository')
export const AccountManagerRepositoryKey: InjectionKey<AccountManagerRepository> =
  Symbol('AccountManagerRepository')
