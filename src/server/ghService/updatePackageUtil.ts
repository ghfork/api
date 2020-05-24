import fetch from "node-fetch";
import { MasterCommit } from "./types/update/masterCommitModel";
import { CommitDetails, File } from "./types/update/commitDetailsModel";
import { PackageFileDetails } from "./types/update/packageFileDetailsModel";

import * as jsYaml from "js-yaml";

const COMMITS_BASE_URL =
  "https://api.github.com/repos/microsoft/winget-pkgs/commits?ref=master";
const CONTENTS_BASE_URL =
  "https://api.github.com/repos/microsoft/winget-pkgs/contents";

const { GITHUB_TOKEN } = process.env;

const getCommitsMasterTimeRange = async (): Promise<string[]> => {
  //   const since = new Date().toISOString();
  //   const until = new Date(new Date().setMinutes(new Date().getMinutes() + 30)).toISOString();
  const since = "2020-05-22T19:00:00Z";
  const until = "2020-05-22T20:30:00Z";

  const masterCommits: Promise<MasterCommit[]> = await fetch(
    `${COMMITS_BASE_URL}&&since=${since}&&until=${until}`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    }
  ).then((res) => res.json());

  const commitUrls = (await masterCommits).map((commit) => commit.url);

  return commitUrls;
};

const getUpdatedFileFath = async (): Promise<string[]> => {
  const commitUrls = await getCommitsMasterTimeRange();

  const commitDetails: CommitDetails[] = await Promise.all(
    commitUrls.map((commitUrl) =>
      fetch(commitUrl, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }).then((res) => res.json())
    )
  );

  const files = commitDetails.map((commitDetail) => commitDetail.files);
  const flatFiles: File[] = files.flat(files.length);
  const filePaths = flatFiles.map((file) => file.filename);

  return filePaths;
};

const getPackageDownloadUrls = async (): Promise<string[]> => {
  const updatedFilePaths = await getUpdatedFileFath();

  const packageFileDetails: PackageFileDetails[] = await Promise.all(
    updatedFilePaths.map((path) =>
      fetch(`${CONTENTS_BASE_URL}/${path}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }).then((res) => res.json())
    )
  );

  const downloadUrls = packageFileDetails.map((pkg) => pkg.download_url);

  return downloadUrls;
};

const getUpdatedPackageYamls = async () => {
  const downloadUrls = await (await getPackageDownloadUrls()).filter(
    (url) => url != null
  );

  const updatePackageYamls = Promise.all(
    downloadUrls.map((url) =>
      fetch(url, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      })
        .then((res) => res.text())
        .then((txt) => jsYaml.safeLoad(txt))
    )
  );

  return updatePackageYamls;
};

export = { getUpdatedPackageYamls };
