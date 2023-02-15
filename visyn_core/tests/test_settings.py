import os
from unittest import mock

from visyn_core.settings.model import GlobalSettings


def test_env_substitution():
    settings = GlobalSettings()

    assert settings.secret_key != "Custom_Secret_Key"
    assert settings.visyn_core.security.store.alb_security_store.enable != True  # NOQA: E712
    assert settings.visyn_core.logging["version"] == 1
    assert settings.visyn_core.logging["root"]["level"] == "INFO"

    with mock.patch.dict(
        os.environ,
        {
            # Basic top-level key substitution
            "SECRET_KEY": "Custom_Secret_Key",
            # Deeply nested key substitution of properly typed model (includes automatic typecast)
            "visyn_core__SECURITY__STORE__ALB_SECURITY_STORE__ENABLE": "True",
            # Deeply nested key substitution of model typed via Dict (does not include automatic typecast)
            "visyn_core__LOGGING__VERSION": "2",
            "visyn_core__LOGGING__ROOT__LEVEL": "DEBUG",
        },
        clear=True,
    ):
        env_settings = GlobalSettings()

        assert env_settings.secret_key == "Custom_Secret_Key"
        assert env_settings.visyn_core.security.store.alb_security_store.enable == True  # NOQA: E712
        assert env_settings.visyn_core.logging["version"] == "2"  # Note that this is a string, as it cannot infer the type of Dict
        assert env_settings.visyn_core.logging["root"]["level"] == "DEBUG"

        assert env_settings.get_nested("secret_key") == "Custom_Secret_Key"
        assert env_settings.get_nested("visyn_core.security.store.alb_security_store.enable") == True  # NOQA: E712
        assert (
            env_settings.get_nested("visyn_core.logging.version") == "2"
        )  # Note that this is a string, as it cannot infer the type of Dict
        assert env_settings.get_nested("visyn_core.logging.root.level") == "DEBUG"
