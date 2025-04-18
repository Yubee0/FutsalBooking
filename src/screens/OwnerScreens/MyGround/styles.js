import {StyleSheet} from 'react-native';
import {ownerColors} from '../../../constants/color';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ownerColors.BACKGROUND,
  },
  header: {
    padding: 20,
    backgroundColor: ownerColors.PRIMARY,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ownerColors.WHITE,
  },
  subtitle: {
    fontSize: 16,
    color: ownerColors.WHITE,
    opacity: 0.8,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: ownerColors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: ownerColors.BORDER,
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  tabText: {
    fontSize: 16,
    color: ownerColors.TEXT_SECONDARY,
  },
  activeTabText: {
    color: ownerColors.PRIMARY,
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '50%',
    backgroundColor: ownerColors.PRIMARY,
  },
  tabLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTabText: {
    fontSize: 16,
    color: ownerColors.TEXT_SECONDARY,
    marginTop: 16,
    textAlign: 'center',
  },
  tabContent: {
    padding: 16,
  },
  bookingActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  acceptButton: {
    backgroundColor: ownerColors.SUCCESS,
  },
  rejectButton: {
    backgroundColor: ownerColors.ERROR,
  },
  actionText: {
    color: ownerColors.WHITE,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
