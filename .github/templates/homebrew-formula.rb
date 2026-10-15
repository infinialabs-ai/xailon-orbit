class XailonOrbitd < Formula
  desc "Local agent daemon and session manager for XailonOrbit"
  homepage "https://github.com/__REPO__"
  version "__VERSION__"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/__REPO__/releases/download/__TAG__/xailon-orbitd-aarch64-apple-darwin.tar.gz"
      sha256 "__MAC_ARM__"
    end
    on_intel do
      url "https://github.com/__REPO__/releases/download/__TAG__/xailon-orbitd-x86_64-apple-darwin.tar.gz"
      sha256 "__MAC_INTEL__"
    end
  end

  on_linux do
    on_intel do
      url "https://github.com/__REPO__/releases/download/__TAG__/xailon-orbitd-x86_64-unknown-linux-gnu.tar.gz"
      sha256 "__LINUX_X86__"
    end
  end

  def install
    bin.install "xailon-orbitd"
  end

  def caveats
    <<~EOS
      Run `xailon-orbitd` to start the local agent daemon and session manager.
    EOS
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/xailon-orbitd --version")
  end
end
