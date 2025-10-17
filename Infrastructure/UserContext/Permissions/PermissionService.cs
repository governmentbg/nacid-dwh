using Infrastructure.DomainValidation.Models.ErrorCodes;
using Infrastructure.DomainValidation;

namespace Infrastructure.UserContext.Permissions
{
    public class PermissionService
    {
        private readonly UserContext userContext;
        private readonly DomainValidatorService domainValidatorService;

        public PermissionService(
            UserContext userContext,
            DomainValidatorService domainValidatorService
        )
        {
            this.userContext = userContext;
            this.domainValidatorService = domainValidatorService;
        }

        public void VerifyUnitPermissionException(string permission, List<(string, int?)> unitExternalIds)
        {
            if (!VerifyUnitPermission(permission, unitExternalIds))
            {
                domainValidatorService.ThrowErrorMessage(PermissionErrorCode.Permission_NotEnoughPermissions);
            }
        }

        public bool VerifyUnitPermission(string permission, List<(string, int?)> unitExternalIds)
        {
            return userContext.OrganizationalUnits
                .Any(e => unitExternalIds.Any(s => s.Item1 == e.Alias
                    && s.Item2 == e.ExternalId
                    && (string.IsNullOrWhiteSpace(permission) || e.Permissions.Contains(permission))));
        }

        public void VerifyOrganizationalUnitsAliasException(List<string> unitAliases)
        {
            if (!VerifyOrganizationalUnitsAlias(unitAliases))
            {
                domainValidatorService.ThrowErrorMessage(PermissionErrorCode.Permission_NotEnoughPermissions);
            }
        }

        public bool VerifyOrganizationalUnitsAlias(List<string> unitAliases)
        {
            return userContext.OrganizationalUnits.Any(e => unitAliases.Contains(e.Alias));
        }

        public void VerifyPermissionException(string permission)
        {
            if (!VerifyPermission(permission))
            {
                domainValidatorService.ThrowErrorMessage(PermissionErrorCode.Permission_NotEnoughPermissions);
            }
        }

        public bool VerifyPermission(string permission)
        {
            return userContext.OrganizationalUnits.Any(s => s.Permissions.Contains(permission));
        }
    }
}
