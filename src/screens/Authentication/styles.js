import {StyleSheet} from 'react-native';
import {colors} from '../../constants/color';

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  authHeader: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.TEXT_SECONDARY,
  },

  // Form Styles
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: colors.TEXT_PRIMARY,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.TEXT_PRIMARY,
    shadowColor: colors.PRIMARY_LIGHT,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorInput: {
    borderColor: colors.ERROR,
  },
  errorText: {
    color: colors.ERROR,
    fontSize: 14,
    marginTop: 4,
  },

  // Button Styles
  primaryButton: {
    marginTop: 24,
    shadowColor: colors.PRIMARY_DARK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
  },

  // Landing Screen
  landingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.PRIMARY,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
    borderRadius: 30,
    backgroundColor: colors.WHITE,
    padding: 20,
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.WHITE,
    textAlign: 'center',
  },
  landingSubtitle: {
    fontSize: 18,
    color: colors.WHITE,
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  // Signup Specific
  roleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  roleButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.PRIMARY,
    marginHorizontal: 8,
    backgroundColor: colors.WHITE,
  },
  selectedRole: {
    backgroundColor: colors.PRIMARY_LIGHT,
    borderColor: colors.PRIMARY_DARK,
  },
  roleText: {
    color: colors.TEXT_PRIMARY,
    fontWeight: '500',
  },
});

export default styles;
