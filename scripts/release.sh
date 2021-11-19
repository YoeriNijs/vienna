#!/bin/sh

# Update current framework version
while :
do
  case $1 in
	minor)
		npm version minor
		break
		;;
	major)
		npm version major
		break
		;;
	*)
		npm version patch
		;;
  esac
done

# Running build
npm run build

# Tagging new release
NEW_FRAMEWORK_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
git tag -a "$NEW_FRAMEWORK_VERSION" -m "Release $NEW_FRAMEWORK_VERSION"

git add package.json
git commit -m "feat(package.json): release $NEW_FRAMEWORK_VERSION"

# Update changelog and push all changes
npm run version

# Publish new release
npm publish
